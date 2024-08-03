type Props = {
    top: string,
    bottom: string
}

const GridHeader = (props: Props) => {
    return(
        <div>
            <div className="pb-1">{props.top}</div>
            <div>{props.bottom}</div>
        </div>
    );
};

export default GridHeader;