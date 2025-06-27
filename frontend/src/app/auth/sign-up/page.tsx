'use client'
import { SignupForm } from '@/app/shared/signup-form/SignupForm';
import { useRouter } from 'next/navigation';

export default function SignUpPage() {
  const router = useRouter();

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <SignupForm />
    </div>
  );
}

