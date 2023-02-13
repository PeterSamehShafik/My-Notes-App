	import React from 'react'
	import { NavLink} from 'react-router-dom';
	import './Navbar.css'


	export default function Navbar({currentUser, handleLogout}) {

		
	return (
		<>

		<nav className="navbar navbar-expand-lg navbar-custom  navbar-dark fixed-top">
			<div className="container container mx-auto align-items-center">
			
			<NavLink className="navbar-brand " to="/">
				<i className="far fa-sticky-note me-2"></i>
				<span>My Notes</span>
			</NavLink>
			<button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
				<span >Menu</span>
				<span className="navbar-toggler-icon"></span>
			</button>
			<div className="collapse navbar-collapse" id="navbarSupportedContent">

				{currentUser?
				<div className="d-flex w-100 justify-content-center align-items-center lead text-warning fw-bolder">
					<span>Welcome</span>
					<span className='ms-2'> {currentUser.user.first_name}!</span>
				</div>
				:
				''
				}

				<ul className="navbar-nav ms-auto mb-2 mb-lg-0">
					<li className="nav-item dropdown-center">
						<a className="nav-link dropdown-toggle " href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
						{currentUser?'Logout':'Sign in'}
						</a>
						<ul className="dropdown-menu shadow dropdown-menu-dark">	
						{currentUser?
							<li className="nav-item">
								<span onClick={handleLogout} className="nav-link">Sign out</span>
							</li>
							:
							<><li className="nav-item">
								<NavLink className="nav-link" to='/login'>Login</NavLink>
							</li>

								<li className="nav-item">
								<NavLink className="nav-link" to='/register'>Register</NavLink>
							</li>	</>
							}
						</ul>
					</li>
				</ul>				      	      			   
			</div>
			</div>
		</nav>
		
		</>	
	)
	}