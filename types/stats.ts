export type StatItem = {
    value: string | number;
    label: string;
};

export type StatsCardProps = {
    title: string;
    icon: string;
    stats: StatItem[];
};
