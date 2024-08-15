async function getEditorActivity(project, year) {
    const yearInt = parseInt( year, 10 );
    const suffix = `${yearInt - 1}0101/${yearInt - 1}1231`;
    const prefix = 'https://wikimedia.org/api/rest_v1/metrics';
    const numNewEditors = await fetch(`${prefix}/registered-users/new/${project}/monthly/${suffix}`)
        .then((resp) => resp.json())
        .then((json) => {
            return json.items[0].results.reduce((accumulator, a)=> accumulator + a['new_registered_users'], 0);
        })
    const numEditors = await fetch(`${prefix}/editors/aggregate/${project}/all-editor-types/content/all-activity-levels/monthly/${suffix}`)
        .then((resp) => resp.json())
        .then((json) => {
            return json.items[0].results.reduce((accumulator, a)=> accumulator + a.editors, 0);
        })
    const numEdits = await fetch(`${prefix}/edits/aggregate/${project}/all-editor-types/content/monthly/${suffix}`)
        .then((resp) => resp.json())
        .then((json) => {
            return json.items[0].results.reduce((accumulator, a)=> accumulator + a.edits, 0);
        })
    const bytes = await fetch(`${prefix}/bytes-difference/net/aggregate/${project}/all-editor-types/content/monthly/${suffix}`)
        .then((resp) => resp.json())
        .then((json) => {
            return json.items[0].results.reduce((accumulator, a)=> accumulator + a['net_bytes_diff'], 0);
        })
    return {
        numNewEditors,
        bytes,
        numEditors,
        numEdits
    }
}
  
export { getEditorActivity }
  
