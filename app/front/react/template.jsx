import React from 'react';

export default function template() {
	var pictures;
	var model = this.props.pictures;
	var pictureStyle = {borderRadius: "2px", margin: "auto", maxWidth: "100%"};
	var buttonStyle = {marginTop: "3px", marginBottom: "10px"}

	if (this.state != null)
		var pictures = this.state["pix"];
	return (
		<div>
			<div id="sideNav" className="sidenav close">
				<div onClick={() => this.props.pictures.closeNav()} style={{display: "flex", justifyContent: "flex-end", marginRight: "15px"}}>
					<div className="arrowBack"></div>
					<div className="arrowBack" style={{marginLeft: "5px"}}></div>
				</div>
			  <a href="#">Trips</a>
			  <a href="#">{model.picsPerPage} per page</a>
				{(() => {
					console.log(model.showAmount);
					if (model.showAmount)
						return (
								<div>
									<h4>&nbsp;&nbsp;&nbsp;5</h4>
									<h4>&nbsp;&nbsp;&nbsp;10</h4>
									<h4>&nbsp;&nbsp;&nbsp;15</h4>
								</div>
						)
				})()}
			</div>
			<div style={{display: "flex", marginLeft: "15px", marginBottom: "10px", justifyContent: "flex-start", maxWidth: "45px"}}>
				<div onClick={() => model.openNav()} style={{display: "flex"}}>
					<div className="arrow"></div>
					<div className="arrow" style={{marginLeft: "5px"}}></div>
				</div>
			</div>
			{(() => {
			if (pictures != null)
  				return (
  					<div style={{display: "flex", flexWrap: "wrap", justifyContent: "space-around"}}>
						{pictures.map(function(pic, index) {
							return (
								<div key={index} style={{display: "flex", alignItems: "center", maxWidth: "500px", flexFlow: "column wrap"}}>
		              <img style={pictureStyle} src={"albums/edited/" + pic.pictureName} />
		              <a download={pic.pictureName} href={'albums/edited/fullSize/' + pic.pictureName}><button style={buttonStyle} className="btn btn-sm">Download full size</button></a>
		            </div>
							)
						})}
					</div>
				)
			})()}
		</div>
	)
}
