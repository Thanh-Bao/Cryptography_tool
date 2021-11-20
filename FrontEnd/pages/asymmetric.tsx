import type { NextPage } from 'next'
import styles from '../styles/Home.module.css'
import Layout from '@/layout/layout'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import MainAsymmetric from "@/components/asymmetric/MainAsymmetric";

const asymmetric: NextPage = () => {
    return (
        <Layout>
            <MainAsymmetric />
        </Layout>
    )
}
export default asymmetric
