import React from "react";

export default function EmployeeDetailsForm() {
     return (
          <div className="details">
               <div className="details__left">
                    <div className="details__avatar">
											<img src="assets/images/avt.jpg" alt="avt" />
										</div>
                    <div className="details__fullname">Nguyen thai ha</div>
                    <div className="details__role">employee</div>
                    <input className="details__btn-edit-avt" type=""/>
                    <div className="details__status"></div>
               </div>
               <div className="details__right"></div>
          </div>
     );
}
