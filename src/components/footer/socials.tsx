import config from '@config'

export default function SocialLinks() {
    const iconStyle = 'leading-8 text-[1.5rem] transition-all duration-200 text-center block text-[var(--color-text-footer)]'

    return (
        <div className='grid justify-between mx-auto mt-20 mb-12 sm:grid-cols-6 grid-cols-3 gap-6 w-fit'>
            <a
                className='block w-8 h-8 mx-auto'
                title='Discord'
                href={config.url.DISCORD_URL}
                target='_blank'
                rel='noreferrer'
            >
                <i className={`${iconStyle} logfont-discord hover:text-[#6571fd]`} />
            </a>
            <a
                className='block w-8 h-8 mx-auto'
                title='Instagram'
                href={config.url.INSTAGRAM_URL}
                target='_blank'
                rel='noreferrer'
            >
                <i className={`${iconStyle} logfont-instagram bg-clip-text hover:text-transparent 
                    bg-[linear-gradient(45deg,#fff695_0%,#fff695_5%,#ff5445_45%,#ff37c0_60%,#3d6dff_90%)]`} />
            </a>
            <a
                className='block w-8 h-8 mx-auto'
                title='Facebook'
                href={config.url.FACEBOOK_URL}
                target='_blank'
                rel='noreferrer'
            >
                <i className={`${iconStyle} logfont-facebook hover:text-[#2c87ff]`} />
            </a>
            <a
                className='block w-8 h-8 mx-auto'
                title='Linkedin'
                href={config.url.LINKEDIN_URL}
                target='_blank'
                rel='noreferrer'
            >
                <i className={`${iconStyle} logfont-linkedin hover:text-[#1a7bdd]`} />
            </a>
            <a
                className='block w-8 h-8 mx-auto'
                title='Gitlab'
                href={config.url.GITLAB_URL}
                target='_blank'
                rel='noreferrer'
            >
                <i className={`${iconStyle} logfont-gitlab hover:text-[#f6492e]`} />
            </a>
            <a
                className='block w-8 h-8 mx-auto'
                title='Wiki'
                href={config.url.WIKI_URL}
                target='_blank'
                rel='noreferrer'
            >
                <i className={`${iconStyle} logfont-wikijs hover:text-[rgb(5,186,243)]`} />
            </a>
        </div>
    )
}
