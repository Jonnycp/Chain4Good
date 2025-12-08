import { Button } from '@heroui/react';
import { Input } from '@heroui/react';

export default function Home() {
  return (
    <div className='dark bg-dark'>
      <h1 className="font-sans bg-secondary">Hello world!</h1>
      <Button>Click Me</Button>
      <Input aria-label="Name" className="w-64" placeholder="Enter your name" />
    </div>
  );
}
