import config from '@config'
import Link from 'next/link'

export default function Version() {
    if (typeof config.version === 'undefined') {
        return <div />
    }

    return (
        <Link
            className={
                'fixed right-4 bottom-4 bg-login-500 text-login-50 px-2 py-1 ' +
                'rounded-md text-white tracking-[0.05em] font-semibold text-lg'
            }
            target='_blank'
            href={`${config.url.GITLAB}/tekkom/web/beehive/beeformed/-/tags/${config.version}`}
        >
            v{config.version}
        </Link>
    )
}