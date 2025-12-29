// src\utils\rolePermissions.js
export const ROLE_PERMISSIONS = {
  ADMIN: {
    dashboard: true,

    students: {
      view: true,
      add: true,
      edit: true,
      delete: true,
    },

    faculty: {
      view: true,
      add: true,
      edit: true,
      delete: true,
    },

    subjects: {
      view: true,
      add: true,
      edit: true,
      delete: true,
    },

    results: {
      view: true,
      publish: true,
    },

    attendance: {
      view: true,
      edit: true,
    },

    chatRole: "ADMIN_HELP",
  },

  FACULTY: {
    dashboard: true,

    students: {
      view: true,
      add: false,
      edit: false,
      delete: false,
    },

    faculty: {
      view: false,
    },

    subjects: {
      view: true,
      add: false,
      edit: false,
      delete: false,
    },

    results: {
      view: true,
      publish: true,
    },

    attendance: {
      view: true,
      edit: true,
    },

    chatRole: "FACULTY_HELP",
  },

  STUDENT: {
    dashboard: true,

    students: {
      view: false,
    },

    faculty: {
      view: false,
    },

    subjects: {
      view: true,
    },

    results: {
      view: true,
      publish: false,
    },

    attendance: {
      view: true,
      edit: false,
    },

    chatRole: "STUDENT_HELP",
  },
};
