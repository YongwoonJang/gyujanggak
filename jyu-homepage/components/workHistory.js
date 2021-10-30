import parse from 'html-react-parser'

export default function WorkHistory(props){

    let workHistory = "<table><tbody>";
    let data = props.data;
    let count = Object.keys(data.workExperience).length;
    
    for (let i = count; i > 0; i--) {
        workHistory = workHistory
            + "<tr><td>"
            + (count + 1 - i).toString() + ". " + "<a href='" + data.workExperience[i]["URL"] + "'>"
            + data.workExperience[i]["Summary"]
            + "</a>("
            + data.workExperience[i]["Period"]
            + ")</td></tr>"
            + "<tr style='font-size: 0.9em; color: rgb(149, 143, 143)'><td>"
            + "&nbsp&nbsp" + data.workExperience[i]["Description"]
            + "</td></tr>"
    }
    workHistory = parse(workHistory + "</tbody></table>");

    
    return(
        <>
            {workHistory}
        </>
    )

}