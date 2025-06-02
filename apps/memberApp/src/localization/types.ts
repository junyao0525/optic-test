export interface Translation {
  app: {
    name: string;
    welcome: string;
    loading: string;
    retry: string;
  };
  auth: {
    login: string;
    logout: string;
    register: string;
    email: string;
    password: string;
    confirm_password: string;
    forgot_password: string;
    remember_me: string;
  };
  home: {
    title: string;
    greeting: string;
    dashboard: string;
    testTypes: string;
    landoltTest: string;
    EyeTiredness: string;
    ColorVision: string;
    AudioTest: string;
  };
  settings: {
    title: string;
    language: string;
    theme: string;
    notifications: string;
    privacy: string;
    about: string;
  };
  language: {
    en: string;
    zh: string;
    current: string;
    popular: string;
    changed: string;
    change_error: string;
    change_info: string;
  };
  common: {
    yes: string;
    no: string;
    cancel: string;
    confirm: string;
    save: string;
    edit: string;
    delete: string;
    next: string;
    previous: string;
    success: string;
    error: string;
  };
} 