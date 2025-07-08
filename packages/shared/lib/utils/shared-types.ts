export type ValueOf<T> = T[keyof T];

export interface IBase {
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

export type Language = 'zh' | 'en';
export type Theme = 'system' | 'dark' | 'light';

export interface Storage {
  apiKey: string;
  apiBaseUrl: string;
  namespaceId: string;
  resourceId: string;
  language: Language;
  theme: Theme;
}

export type Permission = 'no_access' | 'can_view' | 'can_comment' | 'can_edit' | 'full_access';

export interface User extends IBase {
  id: string;
  email: string;
  username: string;
  password?: string;
  password_repeat?: string;
}

export interface Namespace extends IBase {
  id: string;
  name: string;
  collaborators?: string[];
  owner_id?: string[];
}

export type SpaceType = 'private' | 'teamspace';
export type ResourceType = 'doc' | 'file' | 'link' | 'folder';

export interface Resource extends IBase {
  id: string;
  current_level?: Permission;

  resource_type?: ResourceType;
  space_type?: SpaceType;

  parent_id?: string;

  name?: string;
  content?: string;

  tags?: string[];
  attrs?: Record<string, string>;

  globalLevel?: Permission;
}
