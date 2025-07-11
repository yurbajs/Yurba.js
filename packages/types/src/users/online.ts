export interface OnlineModel {
    Online: boolean;
    LastBeen: number;
    Degree: string;
    Status: 'dont_disturb' | 'moved_away' | 'online';
  }
