import React, { useEffect } from 'react'
import { DetailTitle } from '@/components/DetailTitle'
import { IoLocation, IoLogoWhatsapp } from 'react-icons/io5'
import { useConfigStore } from '@/store/configStore';
import { RiFacebookFill, RiInstagramFill } from 'react-icons/ri';
import Link from 'next/link';


const ContactSection = () => {
    const { fetchSettings, settings } = useConfigStore();

    useEffect(() => {
        fetchSettings();
    }, [fetchSettings])

    return (
        <section>
            <div className='flex items-center gap-2 mb-3'>
                <DetailTitle />
                <h2 className='font-bold text-lg'>Contatos</h2>
            </div>
            <div className='flex gap-2 mt-2'>
                <IoLocation className='text-purple-principal-500 text-2xl w-7' />
                <p className='text-md w-full'>{settings.address}</p>
            </div>
            <div className='text-purple-principal-500 flex gap-2 text-2xl my-4'>
                {settings.facebook_url && (<Link href={settings.facebook_url} target='_blank'><RiFacebookFill /></Link>)}
                {settings.instagram_url && (<Link href={settings.instagram_url} target='_blank'><RiInstagramFill /></Link>)}
                {settings.whatsapp_number && (
                    <Link
                        href={`https://api.whatsapp.com/send?phone=${settings.whatsapp_number.replace(/\D/g, '')}`}
                        target="_blank"
                    >
                        <IoLogoWhatsapp />
                    </Link>
                )}

            </div>
        </section>
    )
}

export default ContactSection