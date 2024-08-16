import { fetchWithErrorHandling } from './utils.js';

class EditorActivityAPI {
  static async getEditorActivity(project, year) {
    const yearInt = parseInt(year, 10);
    const startDate = `${yearInt - 1}0101`;
    const endDate = `${yearInt - 1}1231`;
    const prefix = 'https://wikimedia.org/api/rest_v1/metrics';

    try {
      const [newEditors, editors, edits, bytes] = await Promise.all([
        this.fetchNewEditors(prefix, project, startDate, endDate),
        this.fetchEditors(prefix, project, startDate, endDate),
        this.fetchEdits(prefix, project, startDate, endDate),
        this.fetchBytesDifference(prefix, project, startDate, endDate)
      ]);

      return {
        numNewEditors: newEditors,
        numEditors: editors,
        numEdits: edits,
        bytes: bytes
      };
    } catch (error) {
      console.error('Error fetching editor activity:', error);
      throw error;
    }
  }

  static async fetchNewEditors(prefix, project, startDate, endDate) {
    const url = `${prefix}/registered-users/new/${project}/monthly/${startDate}/${endDate}`;
    const json = await fetchWithErrorHandling(url);
    return json.items[0].results.reduce((accumulator, a) => accumulator + a['new_registered_users'], 0);
  }

  static async fetchEditors(prefix, project, startDate, endDate) {
    const url = `${prefix}/editors/aggregate/${project}/all-editor-types/content/all-activity-levels/monthly/${startDate}/${endDate}`;
    const json = await fetchWithErrorHandling(url);
    return json.items[0].results.reduce((accumulator, a) => accumulator + a.editors, 0);
  }

  static async fetchEdits(prefix, project, startDate, endDate) {
    const url = `${prefix}/edits/aggregate/${project}/all-editor-types/content/monthly/${startDate}/${endDate}`;
    const json = await fetchWithErrorHandling(url);
    return json.items[0].results.reduce((accumulator, a) => accumulator + a.edits, 0);
  }

  static async fetchBytesDifference(prefix, project, startDate, endDate) {
    const url = `${prefix}/bytes-difference/net/aggregate/${project}/all-editor-types/content/monthly/${startDate}/${endDate}`;
    const json = await fetchWithErrorHandling(url);
    return json.items[0].results.reduce((accumulator, a) => accumulator + a['net_bytes_diff'], 0);
  }
}

export default EditorActivityAPI;