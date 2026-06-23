import { useTranslation } from 'react-i18next'
import { Grid, Bookmark } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ProfileTabsProps {
  activeTab: 'posts' | 'saved'
  onTabChange: (tab: 'posts' | 'saved') => void
  isOwn?: boolean
}

export function ProfileTabs({
  activeTab,
  onTabChange,
  isOwn,
}: ProfileTabsProps) {
  const { t } = useTranslation()

  return (
    <div className="flex border-t border-[hsl(var(--border))] mt-2">
      <button
        onClick={() => onTabChange('posts')}
        className={cn(
          'flex flex-1 items-center justify-center gap-1 py-3 text-sm font-medium border-t-2 -mt-px transition-colors',
          activeTab === 'posts'
            ? 'border-[hsl(var(--foreground))] text-[hsl(var(--foreground))]'
            : 'border-transparent text-[hsl(var(--muted-foreground))]'
        )}
      >
        <Grid className="h-4 w-4" />
        {t('profile.posts')}
      </button>

      {isOwn && (
        <button
          onClick={() => onTabChange('saved')}
          className={cn(
            'flex flex-1 items-center justify-center gap-1 py-3 text-sm font-medium border-t-2 -mt-px transition-colors',
            activeTab === 'saved'
              ? 'border-[hsl(var(--foreground))] text-[hsl(var(--foreground))]'
              : 'border-transparent text-[hsl(var(--muted-foreground))]'
          )}
        >
          <Bookmark className="h-4 w-4" />
          Saved
        </button>
      )}
    </div>
  )
}
