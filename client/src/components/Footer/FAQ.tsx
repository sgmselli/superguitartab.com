export const FAQ: React.FC = () => {
    return (
        <div className="w-full flex flex-col items-center justify-center gap-5">
            <h2 className="text-2xl sm:text-3xl text-center font-bold primary-color mb-5">Frequently asked questions </h2>
            <div className="collapse collapse-plus bg-base-100 border border-base-300 py-3">
                <input type="checkbox" />
                <div className="collapse-title font-semibold">What is superguitartab.com?</div>
                <div className="collapse-content text-sm"><span className="underline">superguitartab.com</span> sells a wide variety of guitar digital sheet music ready to download at the click of a button.</div>
            </div>
            <div className="collapse collapse-plus bg-base-100 border border-base-300 py-3">
                <input type="checkbox" />
                <div className="collapse-title font-semibold">How do I download a music sheet?</div>
                <div className="collapse-content text-sm">Browse our selection of music sheets, create an account (or sign in if you have one), then you're ready to download!</div>
            </div>
            <div className="collapse collapse-plus bg-base-100 border border-base-300 py-3">
                <input type="checkbox" />
                <div className="collapse-title font-semibold">Is it free?</div>
                <div className="collapse-content text-sm">Currently superguitartab.com is free but a paywall will be introduced soon!</div>
            </div>
            <div className="collapse collapse-plus bg-base-100 border border-base-300 py-3">
                <input type="checkbox" />
                <div className="collapse-title font-semibold">Are the music sheets accurate?</div>
                <div className="collapse-content text-sm">Yes! our music sheets are high quality and show whole songs from intro, to verse, to pre-chorus, to chorus, to outros.</div>
            </div>
        </div>
    )
}