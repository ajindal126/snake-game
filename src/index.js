import React from 'react';
import ReactDOM from 'react-dom';
import User from './Components/User';
import 'normalize.css/normalize.css'
import './index.css';




class Snake extends React.Component{

	constructor(props){
		super(props);

		const grid=[];

		for(let row=0;row<20;row++){
			const column=[];
			for(let col=0;col<20;col++){
				column.push({
					row,col
				});
			}
			grid.push(column);
		}

		this.state={
			grid:grid,
			apple:{
				row:Math.floor(Math.random()*20),
				col:Math.floor(Math.random()*20)
			},
			head:{
					row:10,
					col:10
			},
			tail:[{row:-1,col:-1}],
			velocity:{
				x:1,
				y:0
			},
			gameOver:false,
			userName:undefined,
			bestScore:0
		}
	}


	localStorageValues=()=>{
		let values=[],
		    keys=Object.keys(localStorage),
		    i=keys.length;

		while(i--){
			if(keys[i]){
				values.push(JSON.parse(localStorage.getItem(keys[i])));
			}
			
		}
		this.leaderBoard=values.map((value)=>{
			return (
					<div key={value.userName}>
						<span className="leaderBoard__element">
							<h4>{value.userName}:</h4>
							<p className="bestScore">{value.bestScore}</p>
						</span>
					</div>
				);
			})

	}




	componentDidMount=()=>{
		this.localStorageValues();
	}


	moveSnake=()=>{
		this.setState((prevState)=>{
			return {

					head:{
						row:prevState.head.row+prevState.velocity.y,
						col:prevState.head.col+prevState.velocity.x
					}
				
			}
		},()=>{

			if(this.isBumpedIntoTheWall()){						
				return;
			}else if(this.isApple(this.state.head)){
					this.setState((prevState)=>{
						return ({
						tail:  [...prevState.tail,prevState.head],
						apple:{
							row:Math.floor(Math.random()*20),
							col:Math.floor(Math.random()*20)
						}
					})
					}
					)
			}else if(this.isTail(this.state.head)){
				const {userName,tail}=this.state;

				const user=JSON.parse(localStorage.getItem(userName));
				if(user && user.bestScore < tail.length){
					localStorage.setItem(userName,JSON.stringify({userName:userName,bestScore:tail.length}))
				}else if(!user){
					localStorage.setItem(userName,JSON.stringify({userName:userName,bestScore:tail.length}))
				}

				this.setState((prevState)=>({
					gameOver:true,
					bestScore:(user && prevState.tail.length < user.bestScore) ?  user.bestScore: prevState.tail.length
				}))
			}

			if(this.state.tail.length>0){
				
				this.setState((prevState)=>{
					 prevState.tail.pop();
					return {
					tail:[prevState.head,...prevState.tail]
				}
				})

			}


		})


		if(!this.state.gameOver)
		{
			setTimeout(()=>{
				this.moveSnake();
			},this.speed);

		}


	}

	isBumpedIntoTheWall=()=>{
		const {head,userName,tail}=this.state;
		if(head.col>19 || head.col<0 || head.row>19 || head.row<0){

		const user=JSON.parse(localStorage.getItem(userName));
		if(user && user.bestScore< tail.length){
			localStorage.setItem(userName,JSON.stringify({userName:userName,bestScore:tail.length}))
		}else if(!user){
			localStorage.setItem(userName,JSON.stringify({userName:userName,bestScore:tail.length}))
		}

			this.setState((prevState)=>{
				return {
					gameOver:true,
					bestScore: (user && prevState.tail.length < user.bestScore) ?   user.bestScore : prevState.tail.length
				}
			})
			return true;
		}else{
			return false;
		}
	}


	isApple=(cell)=>{

		if (cell.row===this.state.apple.row && cell.col===this.state.apple.col){
			return true;
		}
		else{
			return false;
		}
	}

	isHead=(cell)=>{
			return (cell.row===this.state.head.row && cell.col=== this.state.head.col)		
	}

	isTail=(cell)=>{
		if(this.state.tail.length>0){
			let updatedTail=[];
			updatedTail=this.state.tail.filter((tail)=>{
				return (cell.row===tail.row && cell.col===tail.col)
			})
		
			if(updatedTail.length>0){
				return true;
			}else{
				return false;
			}
		}else{
			return false
		}	
	}

	checkClass=(cell)=>{
		if(this.isHead(cell)){
			return 'cell head'
		}else if(this.isApple(cell)){
			return 'cell apple'
		}
		else if(this.isTail(cell)){
			return 'cell tail'
		}else{
			return 'cell'
		}
	}

	updateVelocity=(event)=>{
		const {velocity}=this.state;
		if(event.keyCode===38){
			if(velocity.y===1){
				return;
			}
			this.setState((prevState)=>({
				velocity:{
					x:0,
					y:-1
				}
			})
			)
		}else if(event.keyCode===40 ){
			if(velocity.y===-1){
				return;
			}
			this.setState(()=>({
				velocity:{
					x:0,
					y:1
				}
			}))
		}else if(event.keyCode===39 ){
			if(velocity.x===-1){
				return;
			}
			this.setState(()=>({
				velocity:{
					x:1,
					y:0
				}
			}))
		}else if(event.keyCode===37 ){
			if(velocity.x===1){
				return;
			}
			this.setState(()=>({
				velocity:{
					x:-1,
					y:0
				}
			}))
		}
	}


	startNewGame=(speed)=>{
		this.setState((prevState)=>{
			return {

			apple:{
				row:Math.floor(Math.random()*20),
				col:Math.floor(Math.random()*20)
			},
			head:{
					row:10,
					col:10
			},
			tail:[{row:-1,col:-1}],
			velocity:{
				x:1,
				y:0
			},
			gameOver:false		
			}
		})

		this.localStorageValues();
		this.speed=speed;
		setTimeout(()=>{
			this.moveSnake();
		},this.speed);

	}




	setUser=(user)=>{
		this.setState(()=>({
			userName:user,
			apple:{
				row:Math.floor(Math.random()*20),
				col:Math.floor(Math.random()*20)
			},
			head:{
					row:10,
					col:10
			},
			tail:[{row:-1,col:-1}],
			velocity:{
				x:1,
				y:0
			},
			gameOver:false	
		}))
		

		if(!localStorage.getItem(user)){
			localStorage.setItem(user,JSON.stringify({userName:user,bestScore:0}));
		}else{
			const localStorageUser=JSON.parse(localStorage.getItem(user));
			this.setState(()=>({
				bestScore:localStorageUser.bestScore
			}))
		}
		this.localStorageValues();

		document.addEventListener('keydown',(event)=>{
			this.updateVelocity(event);
		})
		this.speed=600;
		setTimeout(()=>{
			this.moveSnake()
		},this.speed);
	}


	


	render(){
		const {grid}=this.state;
		return (
			<div>

				{!this.state.userName ? <User  setUser={this.setUser} /> : 
				  	<div onKeyDown={this.updateVelocity} className="app" tabIndex="0">

					{this.state.gameOver ? 
						<div>

							<h1 className="header">Your score is: {this.state.tail.length}
							</h1>
							<button className="button" 
								onClick={(e)=>{this.startNewGame(600)}}
							>
							Level 1
							</button>
							<button className="button" 
								onClick={(e)=>{this.startNewGame(400)}}
							>
							Level 2
							</button>
							<button className="button" 
								onClick={(e)=>{this.startNewGame(200)}}
							>
							Level 3
							</button>
							<button className="button" 
								onClick={(e)=>{this.startNewGame(60)}}
							>
							Level 4
							</button>
						</div> 
					:  
					  <div className="box">
					    <div className="leaderBoard">
					    	<h2>Leader Board</h2>
					    	<section>{this.leaderBoard}</section>
					    </div>
						<section className="grid">
							{
								grid.map((row)=>{
									return row.map((cell)=>{
										return (<div key={`key${cell.row}${cell.col}`} className={this.checkClass(cell)}></div>)
									})
								})
							}
						</section>
						<div className="box__bestScore" >
							<h4>Welcome: {this.state.userName}</h4>
							<p>Your Best Score: {this.state.bestScore}</p>
						</div>
					  </div>	
					}

					</div>
				}
			</div>	


		);
	}

}



ReactDOM.render(<Snake/>, document.getElementById('root'));

