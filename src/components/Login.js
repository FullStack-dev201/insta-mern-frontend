import React, { useContext } from "react";
import styled from "styled-components";
import { me, authenticate } from "../services/api";
import useInput from "../hooks/useInput";
import { UserContext } from "../context/UserContext";
import logo from "../assets/logo.png";

export const FormWrapper = styled.div`
	background-color: #fff;
	padding: 1rem;
	width: 350px;
	border: 1px solid #dbdbdb;
	margin: 6rem auto;
	text-align: center;
	padding: 2rem 0;

	img {
		margin-bottom: 1.5rem;
	}

	input {
		display: block;
		margin: 0 auto;
		margin-bottom: 1rem;
		padding: 0.6rem 1.2rem;
		background: #fafafa;
		border: 1px solid #dbdbdb;
		font-family: "Fira Sans", sans-serif;
		font-size: 1rem;
		border-radius: 4px;
		width: 85%;
	}

	input[type="submit"] {
		background-color: #0095f6;
		color: #fff;
		border: 1px solid #fff;
		cursor: pointer;
	}

	p {
		margin-top: 2rem;
	}

	span {
		color: #0095f6;
		cursor: pointer;
	}
`;

const Login = ({ signup }) => {
	const { setUser } = useContext(UserContext);
	const email = useInput("");
	const password = useInput("");

	const handleLogin = async e => {
		e.preventDefault();

		const body = { email: email.value, password: password.value };

		const tokenResponse = await authenticate({ url: "/auth/login", body });

		const userResponse = await me({
			url: "/auth/me",
			token: tokenResponse.data.token
		});

		userResponse.data.data.token = tokenResponse.data.token

		localStorage.setItem('user', JSON.stringify(userResponse.data.data))
		setUser(userResponse.data.data)

		email.setValue("");
		password.setValue("");
	};

	return (
		<FormWrapper onSubmit={handleLogin}>
			<img className="logo" src={logo} alt="logo" />
			<form>
				<input
					type="email"
					placeholder="johnwick@gmail.com"
					value={email.value}
					onChange={email.onChange}
				/>
				<input
					type="password"
					placeholder="mysuperpassword"
					value={password.value}
					onChange={password.onChange}
				/>
				<input type="submit" value="Log In" className="login-btn" />
			</form>

			<div>
				<p>
					Don't have an account? <span onClick={signup}>Sign up</span>
				</p>
			</div>
		</FormWrapper>
	);
};

export default Login;
