<script>
	import { applyAction, enhance } from '$app/forms'
	import { goto } from '$app/navigation'
	import { signinForm } from './signin.remote'
</script>
<svelte:head>
	<title>Sign in</title>
</svelte:head>
<form
	data-testid='signin-form'
	method='POST'
	use:enhance={() => {
		return async ({ result }) => {
			// `result` is an `ActionResult` object
			if (result.type === 'redirect') {
				goto(result.location)
			} else {
				await applyAction(result)
			}
		}
	}}>
	<label>
		Username
		<input
			name='username'
			type='text'>
	</label>
	<label>
		Password
		<input
			name='password'
			type='password'>
	</label>
	<button type='submit'>Log in</button>
</form>

<form
	data-testid='signin-form-remote'
	{...signinForm}>
	<label>
		Username
		<input
			name='username'
			type='text'>
	</label>
	<label>
		Password
		<input
			name='password'
			type='password'>
	</label>
	<button {...signinForm.buttonProps}>Log in</button>
</form>
