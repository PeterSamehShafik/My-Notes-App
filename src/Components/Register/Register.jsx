import axios from 'axios'
import Joi from 'joi'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Register.css'

export default function Register() {

	const [errList, setErrList] = useState(null)
	const [backEndErr, setBackEndErr] = useState(null)

	const [isLoading, setIsLoading] = useState(null)
	const navigate = useNavigate()
	const [user, setUser] = useState({
		"first_name": "",
		"last_name": "",
		"age": 0,
		"email": "",
		"password": ""
	})
	const errStyle = {
		border: 'red 1px solid'
	}


	function getUser(e) {
		setErrList(null)
		let tempUser = { ...user }
		tempUser[e.target.name] = e.target.value
		setUser(tempUser)
	}
	function validateUser(currEle) {
		const schema = Joi.object({
			first_name: Joi.string().alphanum().min(2).max(10).required(),
			last_name: Joi.string().alphanum().min(2).max(10).required(),
			age: Joi.number().min(12).max(100),
			email: Joi.string().email({ minDomainSegments: 2, tlds: false }).required(),
			password: Joi.string().pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/)
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
				if (errList[i].context.key === errName) {
					return errList[i].message
				}

			}
		}

	}
	async function sumbitData(e) {
		e.preventDefault()
		setIsLoading(true)
		if (validateUser()) {
			let result = await axios.post("https://be-server-movie-notes.vercel.app/api/v1/auth/signup", user).catch(function (error) {
				if (error.response) {
					setBackEndErr(error.response.data.message)
					setIsLoading(false);
				}
			})
			if (result?.data?.message === "done") {
				navigate('/login')
				setIsLoading(false);
			}
		}

	}

	return (
		<React.Fragment>
			<div className="w-75 mx-auto vh-100">
				<form className='d-flex flex-column justify-content-center h-100' onSubmit={sumbitData}>
					{/* {errList?.map( (err,idx) => 
				<div key ={idx} className="alert alert-danger p-2">
					{err.message}
				</div> )} */}

					{backEndErr ? <>

						<span className='alert alert-danger'>{backEndErr}</span>
					</> : ''}

					<div className="row">
						<div className="col-lg-6">
							<div className="floating-label-group">
								<input name='first_name' autoFocus onChange={getUser} type="text" className='form-control' required style={(currentErr('first_name')) ? errStyle : {}} />
								{currentErr('first_name') ?
									<>

										<span className='mb-5 text-danger fw-bolder  top-50'>{currentErr('first_name')}</span>
									</> : ''
								}

								<label className="floating-label">Enter First Name</label>
							</div>
						</div>
						<div className="col-lg-6">
							<div className="floating-label-group">
								<input name='last_name' onChange={getUser} type="text" className='form-control' required style={(currentErr('last_name')) ? errStyle : {}} />
								{currentErr('last_name') ?
									<>

										<span className='mb-5 text-danger fw-bolder  top-50'>{currentErr('last_name')}</span>
									</> : ''
								}
								<label className="floating-label">Enter Last Name</label>

							</div>
						</div>
						<div className="col-md-12 ">
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
						<div className="col-md-12 ">
							<div className="floating-label-group">
								<input name='age' onChange={getUser} type="number" className='form-control' required style={(currentErr('age')) ? errStyle : {}} />
								{currentErr('age') ?
									<>

										<span className='mb-5 text-danger fw-bolder  top-50'>{currentErr('age')}</span>
									</> : ''
								}

								<label className="floating-label">Enter Your age</label>
							</div>
						</div>
						<div className="col-md-12 ">

							<div className="floating-label-group">
								<input name='password' onChange={getUser} type="password" className='form-control' required style={(currentErr('password')) ? errStyle : {}} />
								{currentErr('password') ?
									<>
										{/* <div className=''>&nbsp;</div> */}
										<span className='alert text-danger fw-bolder bg-alert top-50'>
											Password is required
											<ul>
												<li>password must contain at least eight characters</li>
												<li>at least one number</li>
												<li>and both lower and uppercase letters</li>
												<li>and special characters</li>

											</ul>
										</span>
									</> : ''
								}

								<label className="floating-label">Enter Your Password</label>
							</div>
						</div>
						<div className="col-md-12 ">
							<button className='btn btn-primary mt-3' type='submit'> {
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