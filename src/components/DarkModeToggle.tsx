
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';

const DarkModeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className="border-2 border-dashed border-transparent hover:border-gray-300 dark:hover:border-gray-600 rounded-xl"
    >
      {theme === 'light' ? (
        <Moon className="w-4 h-4 mr-2" />
      ) : (
        <Sun className="w-4 h-4 mr-2" />
      )}
      {theme === 'light' ? 'Dark' : 'Light'}
    </Button>
  );
};

export default DarkModeToggle;
