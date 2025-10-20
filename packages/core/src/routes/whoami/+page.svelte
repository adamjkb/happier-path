<script>
	/** @type {import('./$types').PageProps}*/
	let { data } = $props()
</script>
<svelte:head>
	<title>Who am I</title>
</svelte:head>

<h1>
	You are:
	{#if data.auth.isAuthenticated}
		{data.auth.credentials.username}
	{:else}
		stranger
	{/if}
</h1>


Auth:

<pre data-testid='auth'>{JSON.stringify(data.auth)}</pre>
