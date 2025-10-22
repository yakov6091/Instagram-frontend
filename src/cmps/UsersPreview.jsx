


export function UsersPreview() {


    return (
        <section className="users-preview-container">
            {/* Logged-in User Info Row */}
            <div className="logged-user-info">
                <img className="user-avatar" src="" />
                <div className="user-details">
                    <span className="user-username">Yakov</span>
                    <span className="user-fullname">Yakov</span>
                </div>
                <button className="switch-btn">Switch</button>
            </div>

            {/* Suggestions Header */}
            <div className="suggestions-header">
                <p>Suggested for you</p>
                <button className="see-all-btn">See All</button>
            </div>

            {/* List of Suggestions */}
            <ul className="users-list">
                <li className="user-prev-item">
                    <img className="user-avatar-sm" src="" />
                    <div className="user-details">
                        <h4 className="suggestion-username">Jon</h4>
                        <p className="suggestion-follow-text">Follow me</p>
                    </div>
                    <button className="follow-btn">Follow</button>
                </li>
                <li className="user-prev-item">
                    <img className="user-avatar-sm" src="" />
                    <div className="user-details">
                        <h4 className="suggestion-username">Jonss</h4>
                        <p className="suggestion-follow-text">Follow me</p>
                    </div>
                    <button className="follow-btn">Follow</button>
                </li>
            </ul>



        </section>
    )

}