export const FullScreenLoader = () => {
    return (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-opacity-40 bg-indigo-500 z-30 flex justify-center items-center">
            <div className="sk-chase">
                <div className="sk-chase-dot before:bg-indigo-500" />
                <div className="sk-chase-dot before:bg-indigo-500" />
                <div className="sk-chase-dot before:bg-indigo-500" />
                <div className="sk-chase-dot before:bg-indigo-500" />
                <div className="sk-chase-dot before:bg-indigo-500" />
                <div className="sk-chase-dot before:bg-indigo-500" />
            </div>
        </div>
    )
}
