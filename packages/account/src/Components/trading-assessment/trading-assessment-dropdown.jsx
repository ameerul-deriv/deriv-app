import React from 'react';
import classNames from 'classnames';
import { Field } from 'formik';
import { DesktopWrapper, Dropdown, MobileWrapper, Text, SelectNative } from '@deriv/components';
import { localize } from '@deriv/translations';
import { MAX_QUESTION_TEXT_LENGTH } from '../../Constants/trading-assessment';

const TradingAssessmentDropdown = ({
    disabled_items,
    item_list,
    onChange,
    values,
    setFieldValue,
    setEnableNextSection,
}) => {
    React.useEffect(() => {
        checkIfAllFieldsFilled();
    }, [values]);

    const checkIfAllFieldsFilled = () => {
        if (values) {
            setEnableNextSection(
                values.cfd_experience &&
                    values.cfd_frequency &&
                    values.trading_experience_financial_instruments &&
                    values.trading_frequency_financial_instruments
            );
        }
    };

    return (
        <div className='trading-assessment__wrapper__dropdown'>
            {item_list.map(question => (
                <Field name={question.form_control} key={question.form_control}>
                    {({ field, meta }) => {
                        const should_extend_trading_frequency_field =
                            question.form_control === 'trading_frequency_financial_instruments' &&
                            question?.question_text.length > MAX_QUESTION_TEXT_LENGTH;

                        return (
                            <React.Fragment>
                                <DesktopWrapper>
                                    <Dropdown
                                        {...field}
                                        classNameDisplay={classNames({
                                            'trading-frequency--field': should_extend_trading_frequency_field,
                                        })}
                                        is_align_text_left
                                        name={question?.form_control}
                                        placeholder={question?.question_text}
                                        list={question?.answer_options}
                                        onChange={e => onChange(e, question.form_control, setFieldValue)}
                                        value={values[question.form_control]}
                                        disabled={disabled_items.includes(question.form_control)}
                                        error={meta.touched && meta.error}
                                    />
                                </DesktopWrapper>
                                <MobileWrapper>
                                    <Text as='h1' color='prominent' weight='bold' size='xs'>
                                        {question?.question_text}
                                    </Text>
                                    <SelectNative
                                        {...field}
                                        placeholder={localize('Please select')}
                                        label={localize('Please select')}
                                        name={question?.form_control}
                                        list_items={question?.answer_options}
                                        onChange={e => {
                                            onChange(e, question.form_control, setFieldValue);
                                        }}
                                        value={values[question.form_control]}
                                        hide_top_placeholder
                                        disabled={disabled_items.includes(question.form_control)}
                                        error={meta.touched && meta.error}
                                    />
                                </MobileWrapper>
                            </React.Fragment>
                        );
                    }}
                </Field>
            ))}
        </div>
    );
};

export default TradingAssessmentDropdown;
