import Dashboard from "../views/Dashboard/Dashboard";

const dashboardRoutes = [
  {
    display: 'Creator, Admin, Executor, Approver',
    path: "/home",
    name: "Home",
    icon: "pe-7s-graph",
    component: Dashboard
  }
  // auth
  // { redirect: true, path: "/", to: "/home", name: "Home" }
];

export default dashboardRoutes;
