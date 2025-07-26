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
import { Home } from './pages/Home';
import { Timeline } from './pages/Timeline';
import { Skillset } from './pages/Skillset';
// import { Start } from './pages/Start';
import { SearchTable } from './pages/SearchTable';
import { Projects } from './pages/Projects';
import Photography from './pages/Photography';
import { WorkDetail } from './pages/WorkDetail';
import { ProjectDetail } from './pages/ProjectDetail';
import { EducationDetail } from './pages/EducationDetail';
import { WorkCompanyDetail } from './pages/WorkCompanyDetail';
import { Blog } from './pages/Blog';
import { BlogPost } from './pages/BlogPost';
import { ThemeProvider } from './components/theme-provider';

const router = createBrowserRouter([
  // {
  //   path: "/",
  //   Component: About,
  // },
  // {
  //   path: "gift",
  //   element: <Gift />,
  // },
  {
    Component: Layout,
    children: [
        { path: "/", Component: Home },
        {
          path: "home",
          element: <Home />,
        },
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
          path: "education/:course",
          element: <EducationDetail />,
        },
        {
          path: "photography",
          element: <Photography />,
        },
        {
          path: "timeline",
          element: <Timeline />,
        },
        {
          path: "skillset",
          element: <Skillset />,
        },
        {
          path: "search",
          element: <SearchTable />,
        },
        {
          path: "blog",
          element: <Blog />,
        },
        {
          path: "blog/:slug",
          element: <BlogPost />,
        },
       
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="system" storageKey="locus-ui-theme">
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>,
)
