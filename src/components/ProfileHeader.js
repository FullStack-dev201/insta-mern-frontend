import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import Follow from "./Follow";
import Modal from "./Modal";
import Button from "../styles/Button";
import { UserContext } from "../context/UserContext";
import { OptionsIcon } from "./Icons";
import { CloseIcon } from "./Icons";

const Wrapper = styled.div`
	display: flex;
	align-items: center;
	font-size: 1.1rem;
	margin-bottom: 2rem;

	.avatar {
		width: 180px;
		height: 180px;
		border-radius: 90px;
		margin-right: 2rem;
		position: relative;
		top: 10px;
	}

	.profile-meta {
		display: flex;
		align-items: baseline;
		margin-bottom: 1rem;
	}

	.profile-meta h2 {
		position: relative;
		top: 3px;
	}

	.profile-stats {
		display: flex;
		margin-bottom: 1rem;
	}

	.options svg {
		position: relative;
		top: 7px;
		margin-left: 1rem;
	}

	span {
		padding-right: 1rem;
	}

	a {
		color: ${props => props.theme.blue};
	}

	@media screen and (max-width: 600px) {
		font-size: 0.9rem;

		.avatar {
			width: 140px;
			height: 140px;
	}

		.profile-meta {
			flex-direction: column;
		}

		button {
			margin-left: 0;
		}
	}
`;

const modalHeaderStyle = {
	display: "flex",
	alignItems: "center",
	justifyContent: "space-between",
	borderBottom: "1px solid #DBDBDB",
	padding: "1rem"
};

const ModalContentWrapper = styled.div`
	padding: 1rem;
	font-size: 0.9rem;

	display: flex;
	justify-content: space-between;
	align-items: center;

	img {
		width: 42px;
		height: 42px;
		border-radius: 21px;
		margin-right: 1rem;
	}

	.profile-info {
		display: flex;
	}

	span {
		color: ${props => props.theme.secondaryColor};
	}

	button {
		font-size: 0.9rem;
		position: relative;
		top: -10px;
	}
`;

const ModalContent = ({ loggedInUser, users, title, closeModal }) => {
	const history = useHistory();

	return (
		<>
			<div style={modalHeaderStyle}>
				<h3>{title}</h3>
				<CloseIcon onClick={closeModal} />
			</div>
			{users.map(user => (
				<ModalContentWrapper key={user._id}>
					<div className="profile-info">
						<img
							className="pointer"
							onClick={() => {
								closeModal();
								history.push(`/${user.username}`);
							}}
							src={user.avatar}
							alt="avatar"
						/>
						<div className="user-info">
							<h3
								className="pointer"
								onClick={() => {
									closeModal();
									history.push(`/${user.username}`);
								}}
							>
								{user.username}
							</h3>
							<span>{user.fullname}</span>
						</div>
					</div>
					<Follow isFollowing={user.isFollowing} userId={user._id} />
				</ModalContentWrapper>
			))}
		</>
	);
};

const ProfileHeader = ({ profile }) => {
	const history = useHistory();
	const { user, setUser } = useContext(UserContext);
	const [followersState, setFollowers] = useState(0);
	const [showFollowersModal, setFollowersModal] = useState(false);
	const [showFollowingModal, setFollowingModal] = useState(false);

	const incFollowers = () => setFollowers(followersState + 1);
	const decFollowers = () => setFollowers(followersState - 1);

	const closeModal = () => {
		setFollowersModal(false);
		setFollowingModal(false);
	};

	const handleLogout = () => {
		setUser(null);
		localStorage.removeItem("user");
	};

	useEffect(() => setFollowers(profile?.followersCount), [profile]);

	return (
		<Wrapper>
			<img className="avatar" src={profile?.avatar} alt="avatar" />
			<div className="profile-info">
				<div className="profile-meta">
					<h2>{profile?.username}</h2>
					{profile?.isMe ? (
						<div className="options">
							<Button secondary onClick={() => history.push("/accounts/edit")}>
								Edit Profile
							</Button>
							<OptionsIcon onClick={handleLogout} />
						</div>
					) : (
						<Follow
							isFollowing={profile?.isFollowing}
							incFollowers={incFollowers}
							decFollowers={decFollowers}
							userId={profile?._id}
						/>
					)}
				</div>

				<div className="profile-stats">
					<span>{profile?.postCount} posts</span>

					<span className="pointer" onClick={() => setFollowersModal(true)}>
						{followersState} followers
					</span>

					<span className="pointer" onClick={() => setFollowingModal(true)}>
						{profile?.followingCount} following
					</span>

					{showFollowersModal && (
						<Modal center="true" width="380px">
							<ModalContent
								loggedInUser={user}
								users={profile?.followers}
								closeModal={closeModal}
								title="Followers"
							/>
						</Modal>
					)}

					{showFollowingModal && (
						<Modal center="true" width="380px">
							<ModalContent
								loggedInUser={user}
								users={profile?.following}
								closeModal={closeModal}
								title="Following"
							/>
						</Modal>
					)}
				</div>

				<div className="bio">
					<span className="bold">{profile?.fullname}</span>
					<p>{profile?.bio}</p>
					<a href={profile?.website} target="_blank" rel="noopener noreferrer">
						{profile?.website}
					</a>
				</div>
			</div>
		</Wrapper>
	);
};

export default ProfileHeader;
