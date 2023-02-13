import axios from 'axios'
import Joi from 'joi'
import jwtDecode from 'jwt-decode'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'


export default function Login({ decodeToken }) {

	const [errList, setErrList] = useState(null)
	const [backEndErr, setBackEndErr] = useState(null)

	const [isLoading, setIsLoading] = useState(null)
	const navigate = useNavigate()
	const [user, setUser] = useState({
		"email": ""
	})
	const errStyle = {
		border: 'red 1px solid'
	}

	function getUser(e) {
		setErrList(null)
		let tempUser = { ...user }
		tempUser[e.target.name] = e.target.value
		setUser(tempUser)
		// console.log(tempUser);
	}
	function validateUser() {
		const schema = Joi.object({
			email: Joi.string().email({ minDomainSegments: 2, tlds: false }).required(),
			password: Joi.string()
		})
		let { error } = schema.validate(user, { abortEarly: false });
		if (error) {
			// console.log(error.details);
			setErrList(error.details)
			setIsLoading(false)
		} else {
			return true;
		}

	}
	function currentErr(errName) {
		if (errList) {
			for (let i = 0; i < errList.length; i++) {
				if (errList[i].context.key == errName) {
					return errList[i].message
				}

			}
		}

	}
	async function sumbitData(e) {
		e.preventDefault()

		setIsLoading(true)
		if (validateUser()) {
			let result = await axios.post("https://be-server-movie-notes.vercel.app/api/v1/auth/signin", user).catch(function (error) {
				if (error.response) {
					setBackEndErr(error.response.data.message)
					setIsLoading(false);
				}
			})
			if (result?.data?.message === "done") {
				localStorage.setItem("userToken", result.data.token)
				decodeToken()
				navigate('/notes')
				setIsLoading(false);
			}
		}
	}

	return (
		<React.Fragment>
			<div className="container mx-auto vh-100">
				<form className='d-flex flex-column justify-content-center h-100' onSubmit={sumbitData}>
					{/* {errList?.map( (err,idx) => 
				<div key ={idx} className="alert alert-danger p-2">
					{err.message}
				</div> )} */}

					{backEndErr ? <>
						<div className='row justify-content-center'>
							<span className='alert alert-danger w-50 mb-5	'>{backEndErr}</span>
						</div>
					</> : ''}

					<div className="row">
						<div className="col-md-6 offset-md-3">
							<div className="floating-label-group">
								<input name='email' onChange={getUser} type="text" className='form-control' required style={(currentErr('email')) ? errStyle : {}} />
								{currentErr('email') ?
									<>

										<span className='mb-5 text-danger fw-bolder  top-50'>{currentErr('email')}</span>
									</> : ''
								}

								<label className="floating-label">Enter Your Email</label>
							</div>
						</div>
						<div className="col-md-6 offset-md-3">

							<div className="floating-label-group">
								<input name='password' onChange={getUser} type="password" className='form-control' required />

								<label className="floating-label">Enter Your Password</label>
							</div>
						</div>
						<div className="col-md-6 offset-md-3">
							<button className='btn btn-primary mt-3' type='sumbit'> {
								isLoading ? <div className="lds-dual-ring"></div>
									: 'Sign in'
							}</button>
						</div>
					</div>
				</form>

			</div>
		</React.Fragment>
	)
}