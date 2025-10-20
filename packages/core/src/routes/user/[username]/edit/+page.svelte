<script>
	/** @type {import('./$types').PageProps}*/
	let { data } = $props()
</script>
<svelte:head>
	<title>{data.auth.credentials.username} | edit</title>
</svelte:head>

<h1>
	Your username: {data.auth.credentials.username}
</h1>


All your secrets:

<pre data-testid='auth'>{JSON.stringify(data.auth)}</pre>
