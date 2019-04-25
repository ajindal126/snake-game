import React from 'react';
 
export default class User extends React.Component{

	
	submitUser=(e)=>{
		e.preventDefault();
		const user=e.target.elements.user.value.trim();

		if(user){
			this.props.setUser(user);
		}
		else{
			
		}
	}


	render(){
		return (
			<div className="form">
				<h1>Enter into game</h1>
				<form onSubmit={this.submitUser} className="form__mainForm">
					<input type="text" name="user" className="form__input" placeholder="Username..." />
					<button className="button">Play</button>
				</form>
			</div>
		);
	}
}