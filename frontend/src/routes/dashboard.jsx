import Dashboard from "../views/Dashboard/Dashboard";
import UpdatePenipu from "../views/Penipu/UpdatePenipu";
import NewPenipu from "../views/Penipu/NewPenipu";
import ViewPenipu from "../views/Penipu/ViewPenipu";



const dashboardRoutes = [
  {
    display: 'Creator, Admin, Executor, Approver',
    show: true,
    path: "/home",
    name: "Home",
    icon: "pe-7s-graph",
    component: Dashboard
  },
  {
    display: 'Creator, Admin, Executor, Approver',
    show: false,
    path: "/view/penipu",
    name: "Home",
    icon: "pe-7s-graph",
    component: ViewPenipu
  },
  {
    display: 'Creator, Admin, Executor, Approver',
    show: false,
    path: "/update/penipu",
    name: "Home",
    icon: "pe-7s-graph",
    component: UpdatePenipu
  },
  {
    display: 'Creator, Admin, Executor, Approver',
    show: false,
    path: "/newPenipu",
    name: "Home",
    icon: "pe-7s-graph",
    component: NewPenipu
  }
  // auth
  // { redirect: true, path: "/", to: "/home", name: "Home" }
];

export default dashboardRoutes;
