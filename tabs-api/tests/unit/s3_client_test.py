from app.external_services.s3_client import S3Client

def test_generate_presigned_url_success(mock_boto_client):
    client = S3Client()
    url = client.generate_presigned_url("test-file.pdf", expires_in=600)

    assert url == "https://fake-url/test-file.pdf?expires=600"

def test_generate_presigned_url_failure(monkeypatch, mock_boto_client):
    def raise_error(*args, **kwargs):
        raise Exception("Boom")

    monkeypatch.setattr(
        mock_boto_client,
        "generate_presigned_url",
        raise_error
    )

    client = S3Client()
    url = client.generate_presigned_url("bad-file.pdf")

    assert url is None

import pytest

@pytest.mark.asyncio
async def test_upload_fileobj_success(monkeypatch, mock_boto_client):
    client = S3Client()

    class MockUploadFile:
        async def read(self):
            return b"fake-pdf-data"

    file = MockUploadFile()
    result = await client.upload_fileobj("test.pdf", file)

    assert result is True
    assert mock_boto_client.upload_called is True

@pytest.mark.asyncio
async def test_upload_fileobj_failure(monkeypatch, mock_boto_client):
    def raise_error(*args, **kwargs):
        raise Exception("Upload failed")

    monkeypatch.setattr(
        mock_boto_client,
        "upload_fileobj",
        raise_error
    )

    client = S3Client()

    class MockUploadFile:
        async def read(self):
            return b"fake-data"

    file = MockUploadFile()

    result = await client.upload_fileobj("bad.pdf", file)

    assert result is False

def test_delete_object_success(mock_boto_client):
    client = S3Client()
    result = client.delete_object("file.pdf")

    assert result is True
    assert mock_boto_client.deleted is True

def test_delete_object_failure(monkeypatch, mock_boto_client):
    def raise_error(*args, **kwargs):
        raise Exception("Delete failed")

    monkeypatch.setattr(
        mock_boto_client,
        "delete_object",
        raise_error
    )

    client = S3Client()
    result = client.delete_object("bad.pdf")

    assert result is False