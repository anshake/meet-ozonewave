export interface CommandParameter { parameter: string; description: string; }
export interface Command { command: string; description: string; parameters: CommandParameter[]; }
