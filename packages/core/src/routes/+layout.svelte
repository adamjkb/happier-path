<script>
	let { children } = $props()

	$effect(() => {
		// Signal to playwright tests that the app is loaded
		window.document.body.classList.add('sk-started')
	})
</script>
<nav>
	<a href='/signin'>
		Sign in
	</a>
	<a href='/register'>
		Register
	</a>
</nav>
{@render children()}
