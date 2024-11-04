import { gapi } from 'gapi-script';

const API_KEY = 'YOUR_API_KEY';
const CLIENT_ID = 'YOUR_CLIENT_ID';
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
const SCOPES = "https://www.googleapis.com/auth/calendar.readonly";

class GoogleCalendarService {
    constructor() {
        this.isSignedIn = false;
        this.initClient = this.initClient.bind(this);
        this.updateSigninStatus = this.updateSigninStatus.bind(this);
        this.handleAuthClick = this.handleAuthClick.bind(this);
        this.getCalendarEvents = this.getCalendarEvents.bind(this);
    }

    initClient() {
        return gapi.client.init({
            apiKey: API_KEY,
            clientId: CLIENT_ID,
            discoveryDocs: DISCOVERY_DOCS,
            scope: SCOPES
        }).then(() => {
            gapi.auth2.getAuthInstance().isSignedIn.listen(this.updateSigninStatus);
            this.updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        });
    }

    updateSigninStatus(isSignedIn) {
        this.isSignedIn = isSignedIn;
    }

    handleAuthClick() {
        if (!this.isSignedIn) {
            return gapi.auth2.getAuthInstance().signIn();
        }
        return Promise.resolve();
    }

    async getCalendarEvents() {
        if (!this.isSignedIn) {
            await this.handleAuthClick();
        }

        const now = new Date();
        const oneWeekLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

        const response = await gapi.client.calendar.events.list({
            'calendarId': 'primary',
            'timeMin': now.toISOString(),
            'timeMax': oneWeekLater.toISOString(),
            'showDeleted': false,
            'singleEvents': true,
            'orderBy': 'startTime'
        });

        const events = response.result.items;
        return events.map(event => `${event.start.dateTime || event.start.date}: ${event.summary}`).join('\n');
    }

    loadGapiAndInitClient() {
        return new Promise((resolve, reject) => {
            gapi.load('client:auth2', () => {
                this.initClient().then(resolve).catch(reject);
            });
        });
    }
}

export default new GoogleCalendarService();
