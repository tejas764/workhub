import { createServerSupabaseClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const error = searchParams.get('error')
  const errorDescription = searchParams.get('error_description')

  if (error) {
    console.error('OAuth Error:', error, errorDescription)
    redirect(`/?auth_error=${encodeURIComponent(error)}`)
  }

  if (!code) {
    redirect('/?auth_error=missing_code')
  }

  const supabase = await createServerSupabaseClient()
  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

  if (exchangeError) {
    console.error('Exchange Error:', exchangeError)
    redirect('/?auth_error=session_exchange_failed')
  }

  redirect('/')
}
