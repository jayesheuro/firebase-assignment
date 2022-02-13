const Dashboard = (props) => {
  return (
    <div className="dashboardWrapper">
      This is the dashboard{" "}
      <pre>{JSON.stringify(props.userData.providerData, null, 4)}</pre>
      {/* <h4>{props.userData.displayName}</h4>
      <img src={props.userData.photoURL} alt="avatarImg" /> */}
    </div>
  );
};

export default Dashboard;
