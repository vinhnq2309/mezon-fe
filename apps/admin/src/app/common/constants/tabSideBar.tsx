export interface ITabs {
    name: string;
    routerLink: string;
    imgSrc?: string
    isButton?: boolean;
}

export const tabs: ITabs[] = [
    { name: 'Applications', routerLink: '/admin/applications' },
    { name: 'Teams', routerLink: '/admin/teams' },
    { name: 'Embed Debugger', routerLink: '/admin/embeds' },
    { name: 'Document', routerLink: '/admin/docs' },
];