export interface ClipperData {
    title: string;
    contentMarkdown: string;
    contentHtml: string;
    attachments: Record<string, Blob>;
    workspace: 'select-by-user' | 'last-open-workspace';
}

function getAffineCloudUrlFromCloudString(cloud: string) {
    if (cloud === "affine-cloud") {
        return 'https://affine.fail'
    } else {
        return `https://${cloud}`
    }
}

export function saveToAFFiNE(note: ClipperData, cloud: string) {
    const iframe = document.createElement('iframe');
    iframe.style.width = '100vw';
    iframe.style.height = '100vh';
    iframe.style.position = 'fixed';
    iframe.style.top = '0';
    iframe.style.left = '0';
    iframe.style.border = 'none';
    iframe.style.zIndex = '9999';
    iframe.style.backgroundColor = 'white';
    iframe.src = `${getAffineCloudUrlFromCloudString(cloud)}/clipper/import`;
    // Append iframe to body
    document.body.appendChild(iframe);

    // Post message to the iframe once it's loaded
    iframe.onload = () => {
        console.log('Sending message to AFFiNE:');
        iframe.contentWindow?.postMessage({
            type: 'affine-clipper:import',
            payload: {
                title: note.title,
                contentMarkdown: note.contentMarkdown,
                workspace: note.workspace,
            }
        }, '*');
        if (iframe.contentWindow) {
            console.log("HI")
            window.addEventListener('message', message => {
                if (message.data.type === 'affine-clipper:import:success') {
                    // alert('Successfully imported note to AFFiNE, closing...');
                    window.close();
                }
            }, false);
        }
    };

}