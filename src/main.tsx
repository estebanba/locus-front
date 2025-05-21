import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router";
import './index.css'
import { Layout } from './components/layout/Layout'
import { About } from './pages/About'
import { Work } from './pages/Work';
// import { Home } from './pages/Home';
// import { Start } from './pages/Start';
import { SearchTable } from './pages/SearchTable';
import { Projects } from './pages/Projects';
import { Photography } from './pages/Photography';
import { WorkDetail } from './pages/WorkDetail';
import { ProjectDetail } from './pages/ProjectDetail';
import { WorkCompanyDetail } from './pages/WorkCompanyDetail';

const router = createBrowserRouter([
  // {
  //   path: "/",
  //   Component: About,
  // },
  
  {
    Component: Layout,
    children: [
        { path: "/", Component: About },
        {
          path: "about",
          element: <About />,
        },
        {
          path: "work",
          element: <Work />,
        },
        {
          path: "work/:companyName",
          element: <WorkCompanyDetail />,
        },
        {
          path: "work/:companyName/:projectName",
          element: <WorkDetail />,
        },
        {
          path: "projects",
          element: <Projects />,
        },
        {
          path: "projects/:projectName",
          element: <ProjectDetail />,
        },
        {
          path: "photography",
          element: <Photography />,
        },
        {
          path: "search",
          element: <SearchTable />,
        },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
   <RouterProvider router={router} />
  </StrictMode>,
)
