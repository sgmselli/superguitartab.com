from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File, Form
from sqlalchemy.ext.asyncio import AsyncSession

from app.business_logic.tab_uploader import TabUploader
from app.constants.genre import Genre
from app.constants.style import Style
from app.external_services.s3_client import S3Client
from app.models.user import User
from app.services import tab_services
from app.schema.tab import TabCreate, TabResponse, TabFileUrlResponse
from app.db.session import get_session
from app.constants.http_error_codes import (
    HTTP_201_CREATED,
    HTTP_400_BAD_REQUEST,
    HTTP_404_NOT_FOUND
)
from app.services.tab_services import register_user_tab_download
from app.utils.auth.current_user import get_current_user

router = APIRouter()

@router.get("/tab/{tab_id}", response_model=TabResponse)
async def get_tab(tab_id: int, session: AsyncSession = Depends(get_session)):
    """
    Route to fetch tab by id and return it.
    """
    tab = await tab_services.get_tab_by_id(tab_id, session)
    if not tab:
        raise HTTPException(status_code=HTTP_404_NOT_FOUND, detail="Tab not found")

    presigned_url = S3Client().generate_presigned_url(tab.preview_file_key)
    tab_response = TabResponse.model_validate(tab)
    tab_response.file_url = presigned_url
    return tab_response

@router.get("/tab/{tab_id}/download")
async def get_tab(tab_id: int, session: AsyncSession = Depends(get_session), current_user: User = Depends(get_current_user)):
    """
    Route to fetch tab file url and increment downloads
    """
    tab = await tab_services.get_tab_by_id(tab_id, session)
    if not tab:
        raise HTTPException(status_code=HTTP_404_NOT_FOUND, detail="Tab not found")

    presigned_url = S3Client().generate_presigned_url(tab.file_key)
    
    await register_user_tab_download(current_user.id, tab_id, session)

    return TabFileUrlResponse(file_url=presigned_url)

@router.get("/", response_model=list[TabResponse])
async def get_tabs(
    limit: int = Query(10, ge=1, le=100),
    offset: int = Query(0, ge=0),
    session: AsyncSession = Depends(get_session),
):
    """
    Route to fetch all tabs of a specific genre with pagination.
    """
    tabs = await tab_services.get_tabs(session, limit, offset)
    return  [TabResponse.model_validate(tab) for tab in tabs]

@router.get("/genre/{genre}", response_model=list[TabResponse])
async def get_tabs_by_genre(
    genre: Genre,
    limit: int = Query(10, ge=1, le=100),
    offset: int = Query(0, ge=0),
    session: AsyncSession = Depends(get_session),
):
    """
    Route to fetch all tabs of a specific genre with pagination.
    """
    tabs = await tab_services.get_tabs_by_genre(genre, session, limit, offset)
    return  [TabResponse.model_validate(tab) for tab in tabs if tab.genre == genre]

@router.get("/style/{style}", response_model=list[TabResponse])
async def get_tabs_by_style(
    style: Style,
    limit: int = Query(10, ge=1, le=50),
    offset: int = Query(0, ge=0),
    session: AsyncSession = Depends(get_session),
):
    """
    Route to fetch all tabs of a specific style with pagination.
    """
    tabs = await tab_services.get_tabs_by_style(style, session, limit, offset)
    return  [TabResponse.model_validate(tab) for tab in tabs if tab.style == style]

@router.post("/", response_model=TabResponse)
async def upload_tab_pdf_and_metadata(
    song_name: str = Form(...),
    artist: str = Form(...),
    genre: str = Form(...),
    style: str = Form(...),
    tab_file: UploadFile = File(...),
    session: AsyncSession = Depends(get_session),
):
    """
    Upload a tab file to s3 bucket and its metadata to db.
    """
    if tab_file.content_type != "application/pdf":
        raise HTTPException(status_code=HTTP_400_BAD_REQUEST, detail="Only PDF files are allowed.")

    if not tab_file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=HTTP_400_BAD_REQUEST, detail="Invalid file extension. Only .pdf allowed.")

    tab_uploader = TabUploader(song_name, artist, tab_file)
    if not await tab_uploader.upload_tab():
        raise HTTPException(status_code=HTTP_400_BAD_REQUEST, detail="Failed to upload tab")

    tab_create = TabCreate(
        song_name=song_name,
        artist=artist,
        genre=genre,
        style=style,
        file_key=tab_uploader.get_s3_tab_file_key(),
        file_name=tab_uploader.get_file_name(),
    )
    tab = await tab_services.create_tab(tab_create, session)
    return TabResponse.model_validate(tab)

@router.post("/upload", status_code=HTTP_201_CREATED)
async def upload_tab_pdf(
    song_name: str = Form(...),
    artist: str = Form(...),
    tab_file: UploadFile = File(...),
):
    """
    Upload a tab file to s3 bucket.
    """
    if tab_file.content_type != "application/pdf":
        raise HTTPException(status_code=HTTP_400_BAD_REQUEST, detail="Only PDF files are allowed.")

    if not tab_file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=HTTP_400_BAD_REQUEST, detail="Invalid file extension. Only .pdf allowed.")

    tab_uploader = TabUploader(song_name, artist, tab_file)
    if not await tab_uploader.upload_tab():
        raise HTTPException(status_code=HTTP_400_BAD_REQUEST, detail="Failed to upload tab")

    return {"file_key": tab_uploader.get_s3_tab_file_key()}


@router.get("/search", response_model=list[TabResponse])
async def search_tabs(
    query: str,
    session: AsyncSession = Depends(get_session)
):
    tabs = await tab_services.search_tabs(query, session)
    return [TabResponse.model_validate(tab) for tab in tabs]