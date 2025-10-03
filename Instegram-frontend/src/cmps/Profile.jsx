
import { Svgs } from "./Svg"
export function Profile() {
    return (
        <section className="profile-container">
            <div className="profile-header-row">
                <div className="profile-image">
                    <img src="" alt="" />
                </div>

                <div className="profile-details">
                    <h2 className="profile-name">Name</h2>
                    <div className="profile-stats">
                        <span><b>{0}</b> posts</span>
                        <span><b>{0}</b> followers</span>
                        <span><b>{0}</b> following</span>
                    </div>
                </div>

                <div className="profile-description">
                    <p></p>
                </div>
            </div>

            <div className="profile-gallery">
                <div className="gallery-tabs">
                    <button>{Svgs.gallery}</button>
                    <button>{Svgs.save}</button>
                </div>
            </div>
        </section>
    )

}