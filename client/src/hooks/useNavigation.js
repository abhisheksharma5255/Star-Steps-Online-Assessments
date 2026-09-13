import { useEffect, useState } from "react";

// ==========================================================
// GET INITIAL PAGE
// ==========================================================

function getInitialPage() {
  const path = window.location.pathname;

  if (path === "/admin") {
    return "admin";
  }

  if (path === "/interview") {
    return "interview";
  }

  return "student";
}

// ==========================================================
// NAVIGATION HOOK
// ==========================================================

export default function useNavigation() {
  const [page, setPage] = useState(
    getInitialPage
  );

  // ========================================================
  // NAVIGATE
  // ========================================================

  function navigateTo(targetPage) {
    let path = "/student";

    if (targetPage === "admin") {
      path = "/admin";
    }

    if (targetPage === "interview") {
      path = "/interview";
    }

    window.history.pushState(
      {},
      "",
      path
    );

    setPage(targetPage);
  }

  // ========================================================
  // BROWSER BACK / FORWARD
  // ========================================================

  useEffect(() => {
    function handlePopState() {
      const newPage =
        getInitialPage();

      if (newPage === "admin") {
        const token =
          localStorage.getItem(
            "adminToken"
          );

        if (!token) {
          setPage("admin");
          return;
        }
      }

      setPage(newPage);
    }

    window.addEventListener(
      "popstate",
      handlePopState
    );

    return () => {
      window.removeEventListener(
        "popstate",
        handlePopState
      );
    };
  }, []);

  return {
    page,
    setPage,
    navigateTo,
  };
}