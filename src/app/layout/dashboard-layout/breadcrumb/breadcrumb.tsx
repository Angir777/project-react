import { Fragment } from 'react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse } from '@fortawesome/free-regular-svg-icons';
import {
  Breadcrumb as BreadcrumbRoot,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/shadcn/components/ui/breadcrumb';
import { cn } from '@/shadcn/lib/utils';
import { useBreadcrumbs } from '@/core/router/route-handle';

// "Pill" style – always white text, because the breadcrumb sits on an image background
const pillClasses =
  'inline-flex items-center rounded-full border border-transparent px-3 py-1.5 text-white ' +
  'transition-colors hover:text-white hover:bg-white/14 hover:border-white/10 ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60';

const homeLink = '/';

export function Breadcrumb() {
  const { t } = useTranslation();
  const breadcrumbs = useBreadcrumbs();

  const items = breadcrumbs.map((b, index) => ({
    label: t(b.breadcrumb),
    routerLink: b.url,
    disabled: b.clickable === false || index === breadcrumbs.length - 1,
  }));

  const last = breadcrumbs[breadcrumbs.length - 1];

  // Page title
  const pageTitle = last ? t(last.breadcrumb) : '';

  // Page description
  const pageDescription = last?.description ? t(last.description) : '';

  return (
    <div className="relative overflow-hidden h-36 md:h-44">
      <img
        src="/assets/images/bg/sign-in-bg.png"
        alt="Dashboard banner"
        className="absolute inset-0 w-full h-full object-cover scale-105"
      />

      <div className="absolute inset-0 bg-linear-to-r from-cyan-900/70 via-cyan-800/40 to-transparent"></div>
      <div className="absolute top-0 left-20 w-72 h-72 bg-white/10 blur-3xl rounded-full"></div>

      <div className="relative z-10 h-full flex items-center px-6 md:px-10">
        <div>
          <h1 className="text-white text-2xl md:text-3xl font-bold tracking-tight">{pageTitle}</h1>
          <p className="text-white/80 mt-1 text-sm md:text-base">{pageDescription}</p>
          <div className="flex justify-start mt-3">
            <BreadcrumbRoot className="w-full text-sm text-white">
              <BreadcrumbList className="text-white">
                <BreadcrumbItem>
                  <BreadcrumbLink asChild className={pillClasses}>
                    <Link to={homeLink} aria-label={t('nav.dashboard')}>
                      <FontAwesomeIcon icon={faHouse} aria-hidden="true" />
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>

                {items.map((item, index) => {
                  const isLast = index === items.length - 1;

                  return (
                    <Fragment key={index}>
                      <BreadcrumbSeparator className="text-white/45" />
                      <BreadcrumbItem>
                        {isLast ? (
                          <BreadcrumbPage
                            className={cn(pillClasses, 'font-normal bg-white/8 border-white/10')}
                          >
                            {item.label}
                          </BreadcrumbPage>
                        ) : item.disabled ? (
                          <span
                            aria-disabled="true"
                            className={cn(
                              pillClasses,
                              'cursor-default hover:bg-transparent hover:border-transparent',
                            )}
                          >
                            {item.label}
                          </span>
                        ) : (
                          <BreadcrumbLink asChild className={pillClasses}>
                            <Link to={item.routerLink}>{item.label}</Link>
                          </BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                    </Fragment>
                  );
                })}
              </BreadcrumbList>
            </BreadcrumbRoot>
          </div>
        </div>
      </div>
    </div>
  );
}
