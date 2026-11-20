// The sidebar menu of each portal: [label, url-part]. "" is the overview page.
// To add a screen: add a line here and map it in App.jsx.
export const PORTALS = {
  employee: {
    label: "Employee portal",
    nav: [["Overview", ""], ["Apply for leave", "apply"], ["My leave requests", "requests"], ["Leave calendar", "calendar"], ["My profile", "profile"]],
  },
  manager: {
    label: "Manager portal",
    nav: [["Overview", ""], ["Leave approvals", "approvals"], ["Team leave planner", "planner"], ["My leave requests", "requests"], ["My profile", "profile"]],
  },
  admin: {
    label: "HR & admin portal",
    nav: [["Overview", ""], ["Leave requests", "requests"], ["People directory", "people"], ["Leave calendar", "calendar"], ["My profile", "profile"]],
  },
};
