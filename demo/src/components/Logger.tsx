const str = (obj: any) => JSON.stringify(obj, Object.keys(obj).sort(), 2);

export const Logger = (props: any) => (
    <i>
        <pre>
            { str(props) }
        </pre>
    </i>
)

export default Logger;
