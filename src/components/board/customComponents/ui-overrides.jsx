import {
	DefaultKeyboardShortcutsDialog,
	DefaultKeyboardShortcutsDialogContent,
	TldrawUiMenuItem,
	toolbarItem,
	useTools
} from 'tldraw'

// There's a guide at the bottom of this file!

export const uiOverrides = {
	tools(editor, tools) {
		// Create a tool item in the ui's context.
		tools.DocShape = {
			id: 'DocShape',
			icon: 'tool-file',
			label: 'Add Document',
			kbd: 'j',
			onSelect: () => {
				editor.setCurrentTool('DocShape')
			},
		}
		return tools
	},
	toolbar(_app, toolbar, { tools }) {
		// Add the tool item from the context to the toolbar.
		toolbar.splice(4, 0, toolbarItem(tools.DocShape))
		return toolbar
	},
}

export const components = {
	KeyboardShortcutsDialog: (props) => {
		const tools = useTools()
		return (
			<DefaultKeyboardShortcutsDialog {...props}>
				<DefaultKeyboardShortcutsDialogContent />
				{/* Ideally, we'd interleave this into the tools group */}
				<TldrawUiMenuItem {...tools['DocShape']} />
			</DefaultKeyboardShortcutsDialog>
		)
	},
}

export const customAssetUrls = {
	icons: {
		'tool-file': 'https://unpkg.com/@tldraw/assets@2.0.2/icons/icon/page.svg',
	},
}
