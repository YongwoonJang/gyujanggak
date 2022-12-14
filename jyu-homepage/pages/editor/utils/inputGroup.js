
import { useEffect  } from "react";
import bookEditorStyle from '/styles/bookEditorStyle.module.scss';
import utf8 from "utf8";

export default function InputGroup(props) {

    useEffect(() => {
        if (props.value != null && props.value != undefined) {
            if (props.label === "review") {
                try {
                    props.setValue(props.label, utf8.decode(props.value));
                } catch (e) {
                    console.log(e);
                    props.setValue(props.label, props.value);
                }

            } else {
                props.setValue(props.label, props.value);
            }

        }
    })

    const onHandletextareaKeydown = (e) => {
        let el = e.target;
        setTimeout(() => {
            el.style.cssText = "height:auto;";
            el.style.cssText = "height:" + el.scrollHeight + "px;";
        }, 0);
    }

    const onHandlePreviewChange = (e) => {
        if (e.target.name === "image") {
            const el = document.getElementById("preview");
            const file = document.getElementById("image").files[0];
            console.log(el.src);
            el.src = URL.createObjectURL(file);
            props.setValue("image", file);

        }
    }

    return (
        <div className={bookEditorStyle.row}>
            <div className={bookEditorStyle.col25}>
                <label for={props.label}>{props.label}</label>
            </div>
            <div className={bookEditorStyle.col75}>
                {props.isTextarea ?
                    (<textarea
                        id={props.label}
                        type="text"
                        placeholder={props.placeholder}
                        {...props.register}
                        onKeyDown={onHandletextareaKeydown}
                    />) :
                    (<input
                        id={props.label}
                        type={props.label != "image" ? "text" : "file"}
                        placeholder={props.placeholder}
                        {...props.register}
                        onChange={onHandlePreviewChange}
                    />)}
                {!props.isTextarea && props.label == "image" && <img id="preview" src={props.value} />}
            </div>
            <div>
                {props.errors && <p className={bookEditorStyle.errorMsg}> {props.errors.message}</p>}
            </div>
        </div>
    )
}
