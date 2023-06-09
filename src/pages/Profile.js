import React from "react";
import "../styles/profile.scss";
import bg1 from "../components/assets/bg1.png";
import dummyuser from "../components/assets/userprofile.png";

function Profile(props) {
  console.log(props.userData);

  const downloadTxtFile = async () => {
    const provider = await props.safeInstance.getProvider();
    console.log(provider);
    const privateKey = await provider.request({
      method: "eth_private_key",
    });
    const element = document.createElement("a");
    const file = new Blob([`${privateKey}`], {
      type: "text/plain",
    });
    element.href = URL.createObjectURL(file);
    element.download = "private_key.txt";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  };

  return (
    <div className="profile-main">
      <section className="one">
        <div className="gradient"></div>
        <div className="userinfo">
          <div className="profile-img">
            <img
              src={
                props.userData.profileImg
                  ? props.userData.profileImg
                  : dummyuser
              }
              alt="bg1"
            />
            <span className="balance-title">
              Balance :-
              <span className="balance">
                {props.userData.balance ? props.userData.balance : "0"}
              </span>
            </span>
          </div>
          <h1 className="user-name">
            {props.userData.name ? (
              props.userData.name
            ) : props.userData.address.eoa ? (
              <>
                {props.userData.address.eoa.slice(0, 5) +
                  "..." +
                  props.userData.address.eoa.slice(
                    props.userData.address.eoa.length - 4,
                    props.userData.address.eoa.length
                  )}
              </>
            ) : (
              "User Name"
            )}
          </h1>

          <p className="address">
            {props.userData.address.eoa
              ? props.userData.address.eoa
              : "login to get wallet address"}
          </p>
          <button className="export-key" onClick={downloadTxtFile}>
            Export Private Key
            <svg
              xmlns="http://www.w3.org/2000/svg"
              enable-background="new 0 0 24 24"
              height="24px"
              viewBox="0 0 24 24"
              width="24px"
              fill="#000000"
            >
              <g>
                <rect fill="none" height="24" width="24" />
              </g>
              <g>
                <path d="M16.59,9H15V4c0-0.55-0.45-1-1-1h-4C9.45,3,9,3.45,9,4v5H7.41c-0.89,0-1.34,1.08-0.71,1.71l4.59,4.59 c0.39,0.39,1.02,0.39,1.41,0l4.59-4.59C17.92,10.08,17.48,9,16.59,9z M5,19c0,0.55,0.45,1,1,1h12c0.55,0,1-0.45,1-1s-0.45-1-1-1H6 C5.45,18,5,18.45,5,19z" />
              </g>
            </svg>
          </button>
        </div>
      </section>
    </div>
  );
}

export default Profile;
