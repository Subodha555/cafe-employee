type Props = {
    data: Record<string, React.ReactNode>;
    top: string;
    bottom: string;
}

const TwoRowGrid = ({ data, top, bottom }: Props) => {
    const getNestedData = (path: string, obj: Record<string, any>): React.ReactNode => {
        return path.split('.').reduce((acc, key) => (acc && acc[key] !== undefined) ? acc[key] : null, obj) as React.ReactNode;
    };

    return (
        <div>
            <div>{data[top]}</div>
            <div>{getNestedData(bottom, data)}</div>
        </div>
    );
};

export default TwoRowGrid;
