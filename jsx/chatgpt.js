import { registerPlugin } from '@wordpress/plugins';
import { useState } from '@wordpress/element';
import { dispatch } from '@wordpress/data';
import { createBlock } from '@wordpress/blocks';
import apiFetch from '@wordpress/api-fetch';
import { PluginDocumentSettingPanel } from '@wordpress/edit-post';
import { Button, RangeControl, TextControl } from '@wordpress/components';


const ChatGPTPlugin = () => {

    const [wordCount, setWordCount] = useState(100);
    const [postSubject, setPostSubject] = useState('');

    const generatePost = (postSubject, wordCount) => {
        apiFetch({
            path: '/chatgpt/v1/getresponse',
            method: 'POST',
            data: {
                message: "Create title for current subject: '" + postSubject + "'",
            }
        }).then((data) => {
            dispatch('core/editor').editPost( { title: data.choices[0].message.content } )

            apiFetch({
                path: '/chatgpt/v1/getresponse',
                method: 'POST',
                data: {
                    message: "Create post on the following subject: '" + data.choices[0].message.content + "'. " + wordCount + " words count approximately",
                }
            }).then((data) => {
                const block = createBlock('core/paragraph', { content: data.choices[0].message.content });
                dispatch('core/block-editor').insertBlocks( block );
            })
        })
    }

    return (
        <PluginDocumentSettingPanel
            name="chatgpt-panel"
            title="ChatGPT Panel"
        >
            <TextControl
                label="Post Subject"
                value={ postSubject }
                onChange={ ( value ) => setPostSubject( value ) }
            />
            <RangeControl
                label="Word Count"
                value={ wordCount }
                onChange={ ( value ) => setWordCount( value ) }
                min={100}
                max={1000}
                step={50}
            />
            <Button
                variant="primary"
                onClick={ () => {
                    generatePost(postSubject, wordCount);
                } }
            >
                Generate Post
            </Button>
        </PluginDocumentSettingPanel>
    )
};

registerPlugin('chatgpt-plugin', {
    render: ChatGPTPlugin,
    icon: null,
});
